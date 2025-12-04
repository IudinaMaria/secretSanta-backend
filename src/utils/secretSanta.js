function generatePairs(count) {
  if (count < 2) {
    throw new Error('Нужно минимум 2 участника для жеребьёвки');
  }

  const indices = Array.from({ length: count }, (_, i) => i);

  // перемешиваем
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // чтобы никто не получил сам себя
  for (let i = 0; i < indices.length; i++) {
    if (indices[i] === i) {
      const swapWith = (i + 1) % indices.length;
      [indices[i], indices[swapWith]] = [indices[swapWith], indices[i]];
    }
  }

  return indices; // для участника i -> получатель indices[i]
}

module.exports = { generatePairs };
