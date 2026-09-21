import { NextResponse } from 'next/server';
import { listTemplates } from '@/templates/registry';
import { errorResponse, requireSession } from '@/lib/rbac';

export async function GET() {
  try {
    await requireSession();
    // Served straight from the code registry, so a new template needs no seeding.
    return NextResponse.json({ templates: listTemplates() });
  } catch (err) {
    return errorResponse(err);
  }
}
