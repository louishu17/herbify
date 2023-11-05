import FeedPage from "./feed";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  //router.push("/feed");
  return <FeedPage/>;
}