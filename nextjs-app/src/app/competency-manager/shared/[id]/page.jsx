import SharedFrameworkClient from "./client";

export default function Page({ params }) {
  return <SharedFrameworkClient id={params.id} />;
}
