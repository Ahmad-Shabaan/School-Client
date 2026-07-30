import dompurify from "dompurify";

export const sanitize = (dirty: string) => {
  return dompurify.sanitize(dirty , {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(https?|mailto|tel|ftp|file|data):/i,
  });
}