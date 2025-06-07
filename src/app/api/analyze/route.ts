// two routes post and get 
// post first analyzes the data it gets and pushes to db and returns with the uuid 
// badge/uuid calls the get route to fetch the info based on uuid 

import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import dotenv from "dotenv"

dotenv.config()

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

async function analyze(Xdata: Xdata, ghData: ghData) {
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
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 1000,
        temperature: 0.9, // increased for more personality
      },
    });

    if (!response || !response.text) {
      return { msg: "error occurred" };
    }

    const cleaned = JSON.parse(
      response.text.slice(
        response.text.indexOf("{"),
        response.text.lastIndexOf("}") + 1
      )
    );

    console.log(cleaned);
    return cleaned;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { msg: "AI evaluation failed" };
  }
}


export async function POST(req : NextRequest) {

    const body = await req.json()
    const {XData, ghData, fullName, url, xusername} : {XData : Xdata, ghData : ghData, fullName : string, url: string, xusername: string } = body

    console.log(XData, ghData, fullName, url);
  
    const response : AnalyzeData = await analyze(XData, ghData)
    const uriencodedURL = encodeURI(url)

    if(!response) {
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
                return NextResponse.json({
                    status : 200 ,
                    msg : "Badge generated", 
                    id : updateInfo.id
                })
            } else {
                return NextResponse.json({
                    status : 500 ,
                    msg : "please Try again later"
                })
            }
        }

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
            return NextResponse.json({  
                 status : 200,
                 msg : "Badge Generated", 
                 id : NewUser.id
           })
        }
        else {
            return NextResponse.json({
            status : 400,  
             msg : "Some Error occured"
    })
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status : 500 ,
            msg : "Server is Busy or Down"
        })

    }

  
}

export async function GET(req : NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

    if(!id) {
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
        return NextResponse.json({
            status : 200, 
            findUser
        })
    } else {
        return NextResponse.json({
            status : 500, 
            msg : "internal Server Error"
        })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({
            status : 500, 
            msg : "Server is down"
        })
  }
}