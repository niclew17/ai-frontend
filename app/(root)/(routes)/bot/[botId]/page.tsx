import prismadb from "@/lib/prismadb";
import { BotForm } from "./components/bot-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface BotIdPageProps {
  params: {
    botId: string;
  };
}

const BotIdPage = async ({ params }: BotIdPageProps) => {
  const { userId } = auth();
  // TODO: Check subscription

  if (!userId) {
    return redirectToSignIn();
  }
  const bot = await prismadb.bot.findUnique({
    where: {
      id: params.botId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany();

  return <BotForm initialData={bot} categories={categories} />;
};

export default BotIdPage;
