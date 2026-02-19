import { NextResponse } from 'next/server';
import { policies } from '../../../src/data/policies';

export const dynamic = 'force-dynamic';

export async function GET() {
    const byCategory = {};
    const byStatus = { open: 0, closing: 0, upcoming: 0, closed: 0 };

    for (const p of policies) {
        byCategory[p.category] = (byCategory[p.category] || 0) + 1;
        if (p.status && byStatus[p.status] !== undefined) {
            byStatus[p.status]++;
        }
    }

    return NextResponse.json({
        success: true,
        data: {
            total: policies.length,
            newCount: byStatus.open,
            byCategory,
            byStatus,
        },
    });
}
