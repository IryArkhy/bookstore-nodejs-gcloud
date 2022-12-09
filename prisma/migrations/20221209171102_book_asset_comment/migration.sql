-- CreateTable
CREATE TABLE "BookAssest" (
    "id" TEXT NOT NULL,
    "bookID" TEXT NOT NULL,
    "assetID" TEXT NOT NULL,
    "publicID" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,

    CONSTRAINT "BookAssest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookComment" (
    "id" TEXT NOT NULL,
    "bookID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "BookComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookAssest_bookID_key" ON "BookAssest"("bookID");

-- CreateIndex
CREATE UNIQUE INDEX "BookAssest_id_bookID_key" ON "BookAssest"("id", "bookID");

-- AddForeignKey
ALTER TABLE "BookAssest" ADD CONSTRAINT "BookAssest_bookID_fkey" FOREIGN KEY ("bookID") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookComment" ADD CONSTRAINT "BookComment_bookID_fkey" FOREIGN KEY ("bookID") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookComment" ADD CONSTRAINT "BookComment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
