"use client"

import axios from "axios"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"

interface Xresponse {
  msg : string
  data : { data : {
    id : string,
    name : string,
    username : string,
    created_at : string,
    description : string,
    location : string,
    profile_image_url : string
  } }
}

interface ghResponse {
   totalRepositories: number,
    totalStars : number,
    totalCommits : number,
    topLanguages : string[],
    repositoriesProcessed: number
}


export default function SimpleForm() {
  const [formData, setFormData] = useState({
    twitterID: "",
    githubID: "",
    username: "",
    url: ""
  })

  const [XData , setXData] = useState({
    id: "",
    name: "",
    created_at : "",
    description : "",
    location : "",
    profile_image_url : ""
  })

  const [ghData, setGhData] = useState({
    totalRepositories: 0,
    totalStars : 0,
    totalCommits : 0,
    topLanguages : [""],
    repositoriesProcessed: 0
  })

  const [fullName, setFullName] = useState("")
  const [xusername, setX] = useState("")
  const [ghusername, setGh] = useState("")


  const [focusedField, setFocusedField] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

    const [Ghverifying, setGhVerifying] = useState(false)
  const [Ghverified, GhsetVerified] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleXVerify = async () => {
    setVerifying(true)

     const response = await axios.get<Xresponse>(`/api/getUser?username=${xusername}`)
     const veriData = response.data
     console.log(veriData.data.data)
     setXData({
      id : veriData.data.data.id ,
      name : veriData.data.data.name,
      created_at : veriData.data.data.created_at,
      description : veriData.data.data.description,
      location : veriData.data.data.location,
      profile_image_url : veriData.data.data.profile_image_url
     })
     setVerified(true)

     setVerifying(false)
  }

  const handleGhVerify  = async () => {
    setGhVerifying(true)
    const response = await axios.get<ghResponse>(`/api/github?username=${ghusername}`)
    const veriData = response.data

    setGhData({
      totalRepositories : veriData.totalRepositories,
      totalStars : veriData.totalStars,
      totalCommits: veriData.totalCommits,
      topLanguages : veriData.topLanguages,
      repositoriesProcessed : veriData.repositoriesProcessed
    })

    GhsetVerified(true)

    setGhVerifying(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    alert("Submitted!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur border-gray-700">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Quick Info Form
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Just the basics — no fluff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Twitter ID */}
            <div className="space-y-2">
              <Label htmlFor="twitterID" className="text-gray-300">Twitter Handle</Label>
              <Input
                id="twitterID"
                placeholder="@yourhandle"
                value={formData.twitterID}
                onChange={(e) => {
                   handleInputChange("twitterID", e.target.value);
                   setX(e.target.value)
                  }}
                onFocus={() => setFocusedField("twitterID")}
                onBlur={() => setFocusedField("")}
                className={`bg-gray-800 text-white border-gray-600 placeholder-gray-500 transition-all duration-300 ${
                  focusedField === "twitterID" ? "border-blue-500 scale-105 shadow-blue-500/20 shadow-lg" : ""
                }`}
              />
              <div className="flex items-center gap-2 mt-2">
                {verified ? <CheckCircleIcon className="text-green-500 w-4 h-4" /> : <XCircleIcon className="text-red-500 w-4 h-4" />}
                <Button type="button" size="sm" onClick={handleXVerify} disabled={verifying}>
                  {verifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            {/* GitHub ID */}
            <div className="space-y-2">
              <Label htmlFor="githubID" className="text-gray-300">GitHub Username</Label>
              <Input
                id="githubID"
                placeholder="your-github-id"
                value={formData.githubID}
                onChange={(e) => {
                  handleInputChange("githubID", e.target.value)
                  setGh(e.target.value)
                }}
                onFocus={() => setFocusedField("githubID")}
                onBlur={() => setFocusedField("")}
                className={`bg-gray-800 text-white border-gray-600 placeholder-gray-500 transition-all duration-300 ${
                  focusedField === "githubID" ? "border-blue-500 scale-105 shadow-blue-500/20 shadow-lg" : ""
                }`}
              />
              <div className="flex items-center gap-2 mt-2">
                {Ghverified ? <CheckCircleIcon className="text-green-500 w-4 h-4" /> : <XCircleIcon className="text-red-500 w-4 h-4" />}
                <Button type="button" size="sm" onClick={handleGhVerify} disabled={Ghverifying}>
                  {Ghverifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            {/* Custom Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Full Name</Label>
              <Input
                id="username"
                placeholder="what should we call you?"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField("")}
                className={`bg-gray-800 text-white border-gray-600 placeholder-gray-500 transition-all duration-300 ${
                  focusedField === "username" ? "border-blue-500 scale-105 shadow-blue-500/20 shadow-lg" : ""
                }`}
              />
            </div>

            {/* Url */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-gray-300">Url</Label>
              <Input
                id="url"
                placeholder="enter a portfolio , your github or resume link"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                onFocus={() => setFocusedField("url")}
                onBlur={() => setFocusedField("")}
                className={`bg-gray-800 text-white border-gray-600 placeholder-gray-500 transition-all duration-300 ${
                  focusedField === "username" ? "border-blue-500 scale-105 shadow-blue-500/20 shadow-lg" : ""
                }`}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
