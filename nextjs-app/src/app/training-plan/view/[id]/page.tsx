import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TrainingPlanView from "../../components/TrainingPlanView";

interface TrainingPlanViewPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "View Training Plan | Synthalyst",
  description: "View your saved training plan",
};

export default async function TrainingPlanViewPage({
  params,
}: TrainingPlanViewPageProps) {
  const { id } = params;

  // Get user session
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  // Fetch the training plan
  const trainingPlan = await prisma.trainingPlan.findUnique({
    where: { id },
    include: { user: true },
  });

  // Check if the plan exists and belongs to the user
  if (!trainingPlan || trainingPlan.user.email !== session.user.email) {
    notFound();
  }

  return <TrainingPlanView plan={trainingPlan} />;
}
