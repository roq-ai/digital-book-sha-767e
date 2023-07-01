const mapping: Record<string, string> = {
  books: 'book',
  bookmarks: 'bookmark',
  highlights: 'highlight',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
