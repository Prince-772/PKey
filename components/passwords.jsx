import { Copy } from "lucide-react";
import React from "react";
import PasswordCard from "./passwordCard";

const Passwords = () => {
  let Data = [
    {
      site: "www.google.com",
      email: "pkaddon772@gmail.com",
      username: "pk_addon",
      password:
        "PKpKpKK772",
    },
    {
      site: "www.github.com",
      email: "devking772@example.com",
      username: "code_master772",
      password: "GitSecure772@@",
    },
    {
      site: "www.instagram.com",
      email: "insta.pk772@example.com",
      username: "pk_insta",
      password: "InstaKing772**",
    },
    {
      site: "www.linkedin.com",
      email: "pro.pk772@example.com",
      username: "pk_pro",
      password: "LinkedIn772!!",
    },
    {
      site: "www.reddit.com",
      email: "pkreddit772@example.com",
      password: "RedditSecure772##",
    },
    {
      site: "www.google.com",
      email: "pkaddon772@gmail.com",
      username: "pk_addon",
      password: "PKpKpKK77227722",
    },
    {
      site: "www.github.com",
      email: "devking772@example.com",
      username: "code_master772",
      password: "GitSecure772@@",
    },
    {
      site: "www.instagram.com",
      email: "insta.pk772@example.com",
      username: "pk_insta",
      password: "InstaKing772**",
    },
    {
      site: "www.linkedin.com",
      email: "pro.pk772@example.com",
      username: "pk_pro",
      password: "LinkedIn772!!",
    },
    {
      site: "www.reddit.com",
      email: "pkreddit772@example.com",
      password: "RedditSecure772##",
    },
    {
      site: "www.google.com",
      email: "pkaddon772@gmail.com",
      username: "pk_addon",
      password: "PKpKpKK77227722",
    },
    {
      site: "www.github.com",
      email: "devking772@example.com",
      username: "code_master772",
      password: "GitSecure772@@",
    },
    {
      site: "www.instagram.com",
      email: "insta.pk772@example.com",
      username: "pk_insta",
      password: "InstaKing772**",
    },
    {
      site: "www.linkedin.com",
      email: "pro.pk772@example.com",
      username: "pk_pro",
      password: "LinkedIn772!!",
    },
    {
      site: "www.reddit.com",
      email: "pkreddit772@example.com",
      password: "RedditSecure772##",
    },
  ];

  return (
    <div className="w-full p-3 md:px-6">
      {Data.length === 0 ? (
        <div className="w-full flex items-center justify-center py-20">
          <h1 className="text-2xl font-semibold text-gray-900 text-center">
            No Passwords Found
          </h1>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Data.map((item, index) => (
            <PasswordCard
              key={index}
              platform={item.site}
              username={item.username}
              password={item.password}
              isFav = {false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Passwords;
