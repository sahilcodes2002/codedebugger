-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
