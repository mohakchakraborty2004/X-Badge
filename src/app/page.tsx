"use client"
import ProfileCard from "@/components/profile-card";
import axios from "axios";



export default function Home() {
  return (
    <div>
      <ProfileCard></ProfileCard>
      <button className="bg-black text-white p-3 rounded-lg"
      onClick={async() => {
        const response = await axios.get('/api/getUser?username=I_Mohak19')
        console.log(response.data)
      }}
      >Get User</button>
    </div>
  );
}
