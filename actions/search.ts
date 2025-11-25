"use server";

import { redirect } from "next/navigation";

export async function searchAction(formData: FormData) {
  const search = formData.get("search") as string;
  
  if (search) {
    redirect(`/?search=${encodeURIComponent(search)}`);
  } else {
    redirect("/");
  }
}
