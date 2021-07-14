export async function getCartFromDb(email, password) {
  const response = await fetch('/api/user/cart/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notABeacon: 'nope',
      email,
      password,
    }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error.message);
  return result;
}

export async function sendCartToDb(email, password, cart) {
  const response = await fetch('/api/user/cart/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      cart,
    }),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error.message);
  }
};

export function mergeTwoCarts(cartA, cartB) {
  let mrgd = [], quantity = 0, total = 0, dupesIndex = [], dupesCount = 0;
  const dropItemIntoCart = x => {
    mrgd.push({ ...x });
    quantity += x.quantity;
    total += x.quantity * x.price;
  }
  for (const a of cartA.items) {
    const i = cartB.items.findIndex(x => x.id === a.id);
    const b = cartB.items[i];
    b ? dupesIndex.push(i) && dropItemIntoCart(a.quantity > b.quantity ? a : b) : dropItemIntoCart(a);
  }
  for (const [i, b] of cartB.items.entries()) i === dupesIndex[dupesCount] ? dupesCount++ : dropItemIntoCart(b);
  return { items: mrgd, quantity, total };
}