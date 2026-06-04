import Login from "@/components/auth/login";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Point2 Admin",
};

const HomePage: NextPage = () => <Login />;

export default HomePage;
