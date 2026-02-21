import { calculateOrderTotalRPC } from './src/lib/actions/pricing';

async function test() {
    const res = await calculateOrderTotalRPC(
        [{ item_id: '123e4567-e89b-12d3-a456-426614174000', quantity: 1, has_personalization: false }],
        0,
        'guest_location',
        null,
        10.5,
        false,
        null
    );
    console.log(res);
}

test();
