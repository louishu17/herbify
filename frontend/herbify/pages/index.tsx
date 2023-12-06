import FeedPage from "./feed";
import { useRouter } from "next/router";
import { withAuth } from '@/lib/authCheck';

export const getServerSideProps = withAuth();

export default function HomePage() {
  const router = useRouter();
  //router.push("/feed");
  return <FeedPage/>;
}