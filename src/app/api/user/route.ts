import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, password, confirmpassword, ...rest } = body;

    // Check if password and confirmPassword match
    if (password !== confirmpassword) {
      const errorMessage = "Passwords do not match";
      console.log(`400 Bad Request: ${errorMessage}`);
      return NextResponse.json({ user: null, message: errorMessage }, { status: 400 });
    }

    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email }
    });

    if (existingUserByEmail) {
      const errorMessage = "User with this email already exists";
      console.log(`409 Conflict: ${errorMessage}`);
      return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ user: newUser, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}