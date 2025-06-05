"use server"

import dotenv from "dotenv"
import axios from "axios";
dotenv.config()

export default async function getUser( username : string) {

const token = process.env.BEARER_TOKEN

// const cleanUsername = username.replace('@', '');
      
      // Default fields to fetch
    //   const defaultFields = [
    //     'id',
    //     'name',
    //     'username',
    //     'created_at',
    //     'description',
    //     'location',
    //     'profile_image_url',
    //     'protected',
    //     'public_metrics',
    //     'url',
    //     'verified',
    //     'verified_type'
    //   ];

    //   const fields = defaultFields;
    //   const userFieldsParam = fields.join(',');

      const response = await axios.get(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: {
            'authorization': `Bearer AAAAAAAAAAAAAAAAAAAAADAN2QEAAAAA28nC9L8BWkmXqaWqgMtjuRTufS0%3DFNkAxBidcZ7VqK9PXo5TSg6PT9GPbMOsth6NtgTQq4sQ8uZKy5`
          },
        }
      );

      console.log(response.data)

      return;

}