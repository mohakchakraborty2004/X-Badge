// two routes post and get 
// post first analyzes the data it gets and pushes to db and returns with the uuid 
// badge/uuid calls the get route to fetch the info based on uuid 

import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import dotenv from "dotenv"
import axios from "axios";

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

async function analyze(Xdata : Xdata , ghData : ghData) {
     const prompt = `
   Analyze the following X/twitter data and Github Data which will be given in format of JSON. You are a genz and harsh truth spitter developer, who judges user's profile on the basis of : 
   1. X followers and description 
   2. X username 
   3. Total commits in the processed repositories 
   4. total stars earned in the processed repositories
   5. Top Languages used 
   6. Given other info (very very minimal effect on score but yet affects the score)
   
   After analyzing you give a user a badge out of { NPC, NGMI, MGMI, YGMI, WAGMI }.
   You also give a profile evaluation worth in dollars, his estimated job level/position in market. 
   And remarks on his profile which includes both crticism and suggestion.

   Improvise a bias free and good scoring mechanism where Total stars, Commits, Top languages And followers count carry weight over other aspects but still those can affect it. 

   Your output should be in json and in format like this example : 
   {
        "badge" : "WAGMI", 
        "worth" : "40k $",
        "jobLevel" : "Junior Developer",
        "remarks" : "" (whatever the remarks you give)
   }


   X/ twitter data => ${Xdata} 
   github data => ${ghData}
    
    Please analyze the Data carefully as and return only a JSON with the following structure and strictly nothing else:
    {
        "badge" : NPC/NGMI/MGMI/YGMI/WAGMI,
        "worth" : "money in dollars",
        "jobLevel" : "refer from the example",
        "remarks" : "any remarks as instructed"
    }
  `;

  try {
    const response = await genAI.models.generateContent({ 
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      maxOutputTokens: 1000,
      temperature: 0.1,
    },
    });
    
   if(!response || !response.text) {
        return {
            msg : "error occured"
        }
   }
   
    const cleaned = JSON.parse(response.text.slice(
    response.text.indexOf('{'), 
    response.text.lastIndexOf('}') + 1
    ));

    console.log(cleaned)
    return cleaned
    
} 
catch(error) {
  console.log(error)
}
}

export async function POST(req : NextRequest) {

    const body = await req.json()
    const {XData, ghData, fullName, url} : {XData : Xdata, ghData : ghData, fullName : string, url: string } = body

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
                    Xusername : XData.username,
                    Xname : XData.name,
                    location : XData.location,
                    NgmiBadge : response.badge,
                    created_At : XData.created_at,
                    Worth : response.worth, 
                    jobLevel : response.jobLevel
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
                    Xusername : XData.username,
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