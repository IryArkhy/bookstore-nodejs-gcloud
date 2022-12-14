import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';
import { bufferToDataURI } from '../../modules/file';
import { uploadToCloudinary } from '../../modules/images';
import { CustomError, PrismaClientErrorCodes } from '../../types';

import {
  CreateBookReqBody,
  CreateCommentReqBody,
  DeleteBookReqBody,
  GetBooksReqQuery,
  UpdateBookReqBody,
} from './types';

export const getBooks = async (
  req: Request<any, any, any, GetBooksReqQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req;
    const {
      authorID,
      genre = '',
      year,
      offset: queryOffset,
      limit: queryLimit,
    } = query;

    const offset = queryOffset ? Number(queryOffset) : 0;
    const limit = queryLimit ? Number(queryLimit) : 20;

    const parsedGenres = genre.replace('%', ' ').split(',');
    const shouldIncludeCondition = authorID || genre || year;

    const books = await prisma.book.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        title: 'asc',
      },
      where: shouldIncludeCondition
        ? {
            authorID,
            genres: {
              some: parsedGenres.length
                ? {
                    genre: {
                      name: {
                        in: parsedGenres,
                      },
                    },
                  }
                : undefined,
            },
            year: year ? parseInt(year) : undefined,
          }
        : undefined,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        author: true,
      },
    });

    const count = await prisma.book.count({
      where: shouldIncludeCondition
        ? {
            authorID,
            genres: {
              some: parsedGenres.length
                ? {
                    genre: {
                      name: {
                        in: parsedGenres,
                      },
                    },
                  }
                : undefined,
            },
            year: year ? parseInt(year) : undefined,
          }
        : undefined,
    });
    res.status(200);
    const newOffset = offset + limit;

    res.json({
      books,
      count: count,
      limit,
      offset: newOffset > count ? null : newOffset,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookByID = async (
  req: Request<{ id: string; authorID: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params } = req;

    const book = await prisma.book.findUniqueOrThrow({
      where: {
        id_authorID: {
          id: params.id,
          authorID: params.authorID,
        },
      },
      include: {
        author: true,
        genres: {
          select: {
            genre: true,
          },
        },
        bookComments: {
          include: {
            user: {
              select: {
                username: true,
                id: true,
              },
            },
          },
        },
      },
    });

    res.status(200);
    res.json({
      book,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBook = async (
  req: Request<any, any, any, { query: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req;

    const parsedQuery = decodeURIComponent(query.query);

    if (!parsedQuery.length) {
      return res.status(200).json({
        count: 0,
        books: [],
      });
    }

    const books = await prisma.book.findMany({
      where: {
        OR: [
          {
            description: {
              contains: parsedQuery,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: parsedQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const count = await prisma.book.count({
      where: {
        OR: [
          {
            description: {
              contains: parsedQuery,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: parsedQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    res.status(200);
    res.json({ books, count });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: RequestWithUser<any, any, CreateBookReqBody>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;

  try {
    const book = await prisma.book.create({
      data: {
        title: body.title,
        authorID: body.authorID,
        description: body.description,
        price: body.price,
        genres: {
          createMany: {
            data: body.genres.map(genre => ({
              genreID: genre,
            })),
          },
        },
        year: body.year,
      },
    });

    res.status(201);
    res.json({
      book,
    });
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.uniqueConstraint) {
        errorMessage = 'Book with such title already exists';
      }

      if (error.code === PrismaClientErrorCodes.foreignKeyConstraint) {
        errorMessage = `Invalid input. ${JSON.stringify(error.meta)}`;
      }

      err = new CustomError(errorMessage, 'custom', 400);
    }

    next(err);
  }
};

export const updateBook = async (
  req: RequestWithUser<
    {
      id: string;
    },
    any,
    UpdateBookReqBody
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body, params } = req;

    if (Object.keys(body).length === 0) {
      res.status(400);
      res.json({
        errors: [
          {
            status: 400,
            message: 'No fields to update',
          },
        ],
      });
    } else {
      const book = await prisma.book.update({
        where: {
          id_authorID: {
            id: params.id,
            authorID: body.authorID,
          },
        },
        data: body,
      });
      res.status(200);
      res.json({ message: 'Book updated', book });
    }
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.notFoundOperator) {
        errorMessage = JSON.stringify(error.meta);
      }

      err = new CustomError(errorMessage, 'input');
    }

    next(err);
  }
};

export const deleteBook = async (
  req: RequestWithUser<{ id: string }, any, DeleteBookReqBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params, body } = req;

    await prisma.book.update({
      where: {
        id_authorID: {
          id: params.id,
          authorID: body.authorID,
        },
      },
      data: {
        genres: {
          deleteMany: {},
        },
      },
    });

    const deletedBook = await prisma.book.delete({
      where: {
        id_authorID: {
          id: params.id,
          authorID: body.authorID,
        },
      },
    });

    res.status(200);
    res.json({ message: 'Book deleted', book: deletedBook });
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.notFoundOperator) {
        errorMessage = JSON.stringify(error.meta);
      }

      err = new CustomError(errorMessage, 'input');
    }

    next(err);
  }
};

export const uploadBookImage = async (
  req: Request<{ id: string; authorID: string }>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { file, params } = req;

    const book = await prisma.book.findUniqueOrThrow({
      where: {
        id_authorID: {
          id: params.id,
          authorID: params.authorID,
        },
      },
      include: {
        bookAssest: true,
      },
    });

    if (!file) {
      return response.status(400).json({
        message: 'Image is required',
      });
    }

    const fileFormat = file.mimetype.split('/')[1];
    const { base64 } = bufferToDataURI(fileFormat, file.buffer);

    const imageDetails = await uploadToCloudinary(
      base64,
      fileFormat,
      `${params.id}-${params.authorID}`,
      book.asset && book.bookAssest.publicID
        ? book.bookAssest.publicID
        : undefined,
    );

    const bookAsset = {
      assetID: imageDetails.asset_id,
      publicID: imageDetails.public_id,
      width: imageDetails.width,
      height: imageDetails.height,
      url: imageDetails.url,
      secureUrl: imageDetails.secure_url,
    };

    await prisma.book.update({
      where: {
        id_authorID: {
          id: params.id,
          authorID: params.authorID,
        },
      },

      data: {
        asset: imageDetails.secure_url,
        bookAssest: {
          upsert: {
            create: bookAsset,
            update: bookAsset,
          },
        },
      },
    });

    response.status(200).json({ imageDetails });
  } catch (error) {
    next(error);
  }
};

export const createBookComment = async (
  req: RequestWithUser<
    { id: string; authorID: string },
    any,
    CreateCommentReqBody
  >,
  response: Response,
  next: NextFunction,
) => {
  const { id, authorID } = req.params;
  try {
    const book = await prisma.book.update({
      where: {
        id_authorID: {
          id,
          authorID,
        },
      },
      data: {
        bookComments: {
          create: {
            userID: req.user.id,
            comment: req.body.comment,
          },
        },
      },
      include: {
        bookComments: true,
      },
    });

    response.status(200).json({
      comments: book.bookComments,
    });
  } catch (error) {
    next(error);
  }
};
