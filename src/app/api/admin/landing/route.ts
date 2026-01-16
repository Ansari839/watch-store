export const dynamic = 'force-dynamic';
import { CMSController } from "@/controllers/CMSController";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    return await CMSController.getSettings();
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return await CMSController.updateSettings(req);
}
