import db from "./mongodb";

export async function getCommunities() {
  const communities = await db
    .collection("communities")
    .find({})
    .sort({ order: 1 })
    .toArray();
  return communities;
}
