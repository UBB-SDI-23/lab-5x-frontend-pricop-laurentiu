import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import { axios, handleError } from "../../lib/axios";
import { UserProfile } from "../../lib/types";
import { useState } from "react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id ?? "me";

  const [notFound, setNotFound] = useState(false);

  const { data: profile, isLoading } = useQuery<UserProfile>(["user", userId.toString(), "profile"], () =>
    axios
      .get(`/user/${userId}/profile`)
      .then(data => data.data)
      .catch(err => (err.response.status === 404 ? setNotFound(true) : undefined))
  );

  if (notFound)
    return (
      <Layout>
        {userId === "me" ? "You haven't set up a profile yet." : "This user hasn't set up a profile yet."}
      </Layout>
    );

  if (isLoading || !profile) return <Layout isLoading={true}></Layout>;

  return (
    <Layout>
      <h1 className="text-4xl mb-4">{profile.user!.username}'s Profile</h1>
      <div className="mb-4">{profile.bio}</div>
      <div className="mb-4">Date of birth: {new Date(profile.birthDate).toDateString()}</div>
      <div className="mb-4">Gender: {profile.gender}</div>
      <div className="mb-4">Location: {profile.location}</div>
      <div className="mb-4">
        Website:{" "}
        <a href={profile.website} className="text-blue-500" target="_blank">
          {profile.website}
        </a>
      </div>
      <div className="mb-4 border rounded p-3 px-4">
        <div className="font-bold">{userId === "me" ? "Your contribution" : "User's contribution"}</div>
        <div>
          <i className="bi-bus-front"></i> Buses: {profile._count?.buses}
        </div>
        <div>
          <i className="bi-house"></i> Garages: {profile._count?.garages}
        </div>
        <div>
          <i className="bi-arrow-left-right"></i> Lines: {profile._count?.lines}
        </div>
        <div>
          <i className="bi-signpost"></i> Stations: {profile._count?.stations}
        </div>
      </div>
    </Layout>
  );
}
