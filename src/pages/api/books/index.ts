import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { bookValidationSchema } from 'validationSchema/books';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBooks();
    case 'POST':
      return createBook();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBooks() {
    const data = await prisma.book
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'book'));
    return res.status(200).json(data);
  }

  async function createBook() {
    await bookValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.bookmark?.length > 0) {
      const create_bookmark = body.bookmark;
      body.bookmark = {
        create: create_bookmark,
      };
    } else {
      delete body.bookmark;
    }
    if (body?.highlight?.length > 0) {
      const create_highlight = body.highlight;
      body.highlight = {
        create: create_highlight,
      };
    } else {
      delete body.highlight;
    }
    const data = await prisma.book.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
