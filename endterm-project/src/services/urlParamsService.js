export function buildParamsOnSearchInput({inputValue, currentName, page, limit,}) {
  const trimmed = inputValue.trim();
  if (trimmed === currentName.trim()) {
    return null;
  }
  const next = {};
  if (trimmed) {
    next.name = trimmed;
  }
  next.page = page;
  next.limit = limit;
  return next;
}

export function buildParamsOnLimitChange({ currentName, newLimit }) {
  const next = {};
  if (currentName.trim()) {
    next.name = currentName.trim();
  }
  next.page = 1;
  next.limit = newLimit;
  return next;
}

export function buildParamsOnPrevPage({ currentName, page, limit }) {
  if (page <= 1) return null;
  const next = {};
  if (currentName.trim()) {
    next.name = currentName.trim();
  }
  next.page = page - 1;
  next.limit = limit;
  return next;
}

export function buildParamsOnNextPage({currentName, page, limit, totalPages}) {
  if (totalPages === 0 || page >= totalPages) return null;
  const next = {};
  if (currentName.trim()) {
    next.name = currentName.trim();
  }
  next.page = page + 1;
  next.limit = limit;
  return next;
}
