import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { highlightValidationSchema } from 'validationSchema/highlights';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.highlight
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHighlightById();
    case 'PUT':
      return updateHighlightById();
    case 'DELETE':
      return deleteHighlightById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHighlightById() {
    const data = await prisma.highlight.findFirst(convertQueryToPrismaUtil(req.query, 'highlight'));
    return res.status(200).json(data);
  }

  async function updateHighlightById() {
    await highlightValidationSchema.validate(req.body);
    const data = await prisma.highlight.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteHighlightById() {
    const data = await prisma.highlight.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
