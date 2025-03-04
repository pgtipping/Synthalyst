import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlanEditor } from "../../components/PlanEditor";

export const metadata = {
  title: "Edit Training Plan | Synthalyst",
  description: "Edit your training plan",
};

export default async function EditTrainingPlanPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await props.params;

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/training-plan");
  }

  // Fetch the training plan
  const trainingPlan = await prisma.trainingPlan.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  if (!trainingPlan) {
    redirect("/training-plan?error=plan-not-found");
  }

  // Parse the content
  const content = JSON.parse(trainingPlan.content as string);

  // Transform the plan to include parsed content
  const transformedPlan = {
    ...trainingPlan,
    description: trainingPlan.description || "",
    duration: trainingPlan.duration || "",
    content,
  };

  return (
    <div className="container py-6">
      <PlanEditor plan={transformedPlan} />
    </div>
  );
}
