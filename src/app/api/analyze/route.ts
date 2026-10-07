// two routes post and get 
// post first analyzes the data it gets and pushes to db and returns with the uuid 
// badge/uuid calls the get route to fetch the info based on uuid 

import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import dotenv from "dotenv"

dotenv.config()

// Prisma and the AI SDK require the Node.js runtime when deployed to Vercel.
export const runtime = "nodejs";

interface Xdata {
    id : string,
    name : string,
    username : string,
    created_at : string,
    description : string,
    location : string,
    profile_image_url : string,
    followers : number
  }

interface ghData {
   totalRepositories: number,
    totalStars : number,
    totalCommits : number,
    topLanguages : string[],
    repositoriesProcessed: number
}

interface AnalyzeData {
    badge : string,
    worth : string,
    jobLevel : string,
    remarks : string
}


const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type LogLevel = "info" | "warn" | "error";

function logAnalyzeEvent(
  level: LogLevel,
  event: string,
  context: Record<string, string | number | boolean | undefined> = {}
) {
  // Keep logs deliberately limited to operational metadata. Request payloads and
  // profile fields must never be added here.
  console[level](JSON.stringify({
    service: "analyze-api",
    event,
    ...context,
  }));
}

function errorKind(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}

async function analyze(Xdata: Xdata, ghData: ghData, requestId: string) {
  const prompt = `
You are a brutally honest GenZ developer with sharp judgment. Your job is to rate a user's dev journey and online presence using their GitHub and X (Twitter) data.

Rate them based on:
- GitHub: total commits, total stars, top languages
- X: followers count, description, username
- Slightly consider other info too

Rules:
- Use this scoring guideline (customizable):
  - Total Commits: 0-2000 (weight: 35%)
  - Stars: 0-500+ (weight: 35%)
  - Followers: 0-50k+ (weight: 20%)
  - Description, username, and languages: (10%)

Badges:
- **NPC** – you're invisible.
- **NGMI** – Not Gonna Make It.
- **MGMI** – Might Gonna Make It.
- **YGMI** – You Gonna Make It.
- **WAGMI** – We All Gonna Make It.

Based on total score:
- 0-30 => NPC
- 31-50 => NGMI
- 51-70 => MGMI
- 71-85 => YGMI
- 86+ => WAGMI

Also estimate their **profile worth (in USD)** and **market job level** from:
- Intern, Junior Dev, Mid-level Dev, Senior Dev, Tech Lead, Rockstar Dev

Finally, generate **funny but honest remarks** that include praise, criticism, and practical suggestions.

Return ONLY a JSON:
{
  "badge": "WAGMI",
  "worth": "40k $",
  "jobLevel": "Junior Developer",
  "remarks": "Funny + useful critique here"
}

GitHub Data:
${JSON.stringify(ghData)}

X Data:
${JSON.stringify(Xdata)}
  `;

  try {
    logAnalyzeEvent("info", "ai_analysis_started", { requestId });
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 1000,
        temperature: 0.9, // increased for more personality
      },
    });

    if (!response || !response.text) {
      logAnalyzeEvent("warn", "ai_analysis_empty_response", { requestId });
      return { msg: "error occurred" };
    }

    const cleaned = JSON.parse(
      response.text.slice(
        response.text.indexOf("{"),
        response.text.lastIndexOf("}") + 1
      )
    );

    logAnalyzeEvent("info", "ai_analysis_completed", { requestId });
    return cleaned;
  } catch (error) {
    logAnalyzeEvent("error", "ai_analysis_failed", {
      requestId,
      errorType: errorKind(error),
    });
    return { msg: "AI evaluation failed" };
  }
}


export async function POST(req : NextRequest) {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();
    logAnalyzeEvent("info", "post_request_started", { requestId });

    let body;
    try {
        body = await req.json()
    } catch (error) {
        logAnalyzeEvent("warn", "post_request_json_failed", {
            requestId,
            errorType: errorKind(error),
        });
        throw error;
    }
    const {XData, ghData, fullName, url, xusername} : {XData : Xdata, ghData : ghData, fullName : string, url: string, xusername: string } = body

    logAnalyzeEvent("info", "post_request_parsed", {
        requestId,
        hasXData: Boolean(XData),
        hasGithubData: Boolean(ghData),
    });
  
    const response : AnalyzeData = await analyze(XData, ghData, requestId)
    const uriencodedURL = encodeURI(url)

    if(!response) {
        logAnalyzeEvent("error", "post_analysis_missing", { requestId });
        return NextResponse.json({
            status : 500 ,
            msg : "Some Internal Server Error Occured"
        })
    }

    try {
    
        const res = await prisma.user.findUnique({
            where : {
                Xid : XData.id
            }
        })

        if(res) {
            logAnalyzeEvent("info", "post_persistence_started", { requestId, operation: "update" });
            const updateInfo = await prisma.user.update({
                where : {
                    id : res.id
                } , 
                data : {
                    ghStars : ghData.totalStars,
                    Trepos : ghData.repositoriesProcessed,
                    Tcommits : ghData.totalCommits,
                    remarks : response.remarks,
                    followers : XData.followers,
                    profileUrl : XData.profile_image_url,
                    QrUrl : uriencodedURL,
                    Xusername : xusername,
                    Xname : XData.name,
                    location : XData.location,
                    NgmiBadge : response.badge,
                    created_At : XData.created_at,
                    Worth : response.worth, 
                    jobLevel : response.jobLevel,
                    FullName : fullName
                }
            })

            if(updateInfo) {
                logAnalyzeEvent("info", "post_request_completed", {
                    requestId,
                    operation: "update",
                    durationMs: Date.now() - startedAt,
                });
                return NextResponse.json({
                    status : 200 ,
                    msg : "Badge generated", 
                    id : updateInfo.id
                })
            } else {
                logAnalyzeEvent("error", "post_persistence_no_result", { requestId, operation: "update" });
                return NextResponse.json({
                    status : 500 ,
                    msg : "please Try again later"
                })
            }
        }

        logAnalyzeEvent("info", "post_persistence_started", { requestId, operation: "create" });
        const NewUser = await prisma.user.create({
            data : {
                    ghStars : ghData.totalStars,
                    remarks : response.remarks,
                    followers : XData.followers,
                    profileUrl : XData.profile_image_url,
                    QrUrl : uriencodedURL,
                    Xusername : xusername,
                    Xname : XData.name,
                    location : XData.location,
                    NgmiBadge : response.badge,
                    created_At : XData.created_at,
                    Worth : response.worth, 
                    Xid : XData.id,
                    FullName : fullName,
                    about : XData.description,
                    Trepos : ghData.repositoriesProcessed,
                    Tcommits : ghData.totalCommits,
                    jobLevel : response.jobLevel
            }
        })


        if(NewUser){
            logAnalyzeEvent("info", "post_request_completed", {
                requestId,
                operation: "create",
                durationMs: Date.now() - startedAt,
            });
            return NextResponse.json({  
                 status : 200,
                 msg : "Badge Generated", 
                 id : NewUser.id
           })
        }
        else {
            logAnalyzeEvent("error", "post_persistence_no_result", { requestId, operation: "create" });
            return NextResponse.json({
            status : 400,  
             msg : "Some Error occured"
    })
        }


    } catch (error) {
        logAnalyzeEvent("error", "post_request_failed", {
            requestId,
            errorType: errorKind(error),
            durationMs: Date.now() - startedAt,
        });
        return NextResponse.json({
            status : 500 ,
            msg : "Server is Busy or Down"
        })

    }

  
}

export async function GET(req : NextRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  logAnalyzeEvent("info", "get_request_started", { requestId });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

    if(!id) {
        logAnalyzeEvent("warn", "get_request_invalid", { requestId, reason: "missing_id" });
        return NextResponse.json({
            status : 404,
            msg : "Invalid Id"
        })
    }

  try {
    const findUser =  await prisma.user.findUnique({
        where : {
            id : id
        }
    })

    if (findUser) {
        logAnalyzeEvent("info", "get_request_completed", {
            requestId,
            found: true,
            durationMs: Date.now() - startedAt,
        });
        return NextResponse.json({
            status : 200, 
            findUser
        })
    } else {
        logAnalyzeEvent("warn", "get_request_completed", {
            requestId,
            found: false,
            durationMs: Date.now() - startedAt,
        });
        return NextResponse.json({
            status : 500, 
            msg : "internal Server Error"
        })
    }
  } catch (error) {
    logAnalyzeEvent("error", "get_request_failed", {
        requestId,
        errorType: errorKind(error),
        durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({
            status : 500, 
            msg : "Server is down"
        })
  }
}
