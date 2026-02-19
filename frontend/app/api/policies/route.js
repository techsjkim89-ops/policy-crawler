import { NextResponse } from 'next/server';
import { policies } from '../../../src/data/policies';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isCreditRequired = searchParams.get('isCreditRequired');
    const limit = parseInt(searchParams.get('limit') || '200');

    let result = [...policies];

    if (search) {
        const q = search.toLowerCase();
        result = result.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.organization?.toLowerCase().includes(q) ||
            p.summary?.toLowerCase().includes(q)
        );
    }

    if (category) {
        result = result.filter(p => p.category === category);
    }

    if (isCreditRequired === 'true') {
        result = result.filter(p => p.requiresCreditReport);
    }

    result = result.slice(0, limit);

    return NextResponse.json({
        success: true,
        data: result,
        total: result.length,
    });
}
