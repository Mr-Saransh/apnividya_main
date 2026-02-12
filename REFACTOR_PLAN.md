# Apni Vidya Teacher System Removal - Implementation Plan

## ✅ COMPLETED

### 1. Schema Refactor
- ✅ Removed `EDUCATOR` role from enum - only `STUDENT` and `ADMIN` remain
- ✅ Removed `TeacherSubmission` model
- ✅ Removed `TeacherToken` model  
- ✅ Removed `SubmissionStatus` enum
- ✅ Updated `LessonStatus` enum: `SCHEDULED | LIVE | RECORDED | PUBLISHED`
- ✅ Updated `Lesson` model:
  - Added `liveLink` (String?) for Google Meet/Zoom
  - Added `scheduledAt` (DateTime?) for scheduling
  - Kept `youtubeVideoId` (String?) for recordings
  - Added `createdAt` and `updatedAt` timestamps
  - Removed teacher submission/token relations
- ✅ Deleted `/frontend/src/app/teacher` directory

## 🔄 IN PROGRESS

### 2. Database Migration
**NEXT STEP**: Run Prisma migration to update database

```bash
cd frontend
npx prisma db push
```

### 3. Remove Teacher API Routes
Delete or update these files:
- Check `/frontend/src/app/api/teacher/*` (if exists)
- Update `/frontend/src/app/api/admin/courses/[courseId]/lessons/page.tsx`
  - Remove "Generate Teacher Link" button (line 169)
  - Remove token generation logic (line 69)

### 4. Update Admin Lesson Management UI
File: `/frontend/src/app/admin/courses/[courseId]/lessons/page.tsx`

Changes needed:
- Remove teacher token generation
- Add fields for:
  - Live Link (text input)
  - Scheduled Date/Time (datetime picker)
  - YouTube Video ID (text input)  
  - Status selector (SCHEDULED/LIVE/RECORDED/PUBLISHED)
- Update create/edit lesson form

### 5. Remove Teacher Submissions Page
File: `/frontend/src/app/admin/submissions/page.tsx`
- DELETE this entire file or convert to simple reporting

### 6. Update Student Course Player
File: `/frontend/src/app/(dashboard)/dashboard/courses/[courseId]/page.tsx`

Add conditional rendering:
```tsx
{lesson.status === 'SCHEDULED' && lesson.liveLink && (
  <div className="live-class-section">
    <h3>Upcoming Live Class</h3>
    <p>Scheduled: {format(lesson.scheduledAt, 'PPpp')}</p>
    <Countdown target={lesson.scheduledAt} />
    <Button onClick={() => window.open(lesson.liveLink, '_blank')}>
      Join Live Class
    </Button>
  </div>
)}

{(lesson.status === 'RECORDED' || lesson.status === 'PUBLISHED') && lesson.youtubeVideoId && (
  <div className="video-player">
    <iframe
      width="100%"
      height="500"
      src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)}
```

### 7. Update Navigation
Files to check:
- `/frontend/src/components/layout/sidebar.tsx`
- `/frontend/src/app/(dashboard)/layout.tsx`
- `/frontend/src/app/admin/layout.tsx` (if exists)

Remove any "Teacher" or "Submit" nav items.

### 8. Update Auth/Register Page
File: `/frontend/src/app/(auth)/register/page.tsx`

Remove "EDUCATOR" option from role selector - only allow STUDENT registration.
Admins created manually only.

### 9. Notification System (Optional)
If you want to implement lesson scheduling notifications:

Create: `/frontend/src/app/api/notifications/route.ts`
```typescript
// When admin schedules lesson:
await db.notification.create({
  data: {
    userId: enrolledUser.id,
    type: 'LIVE_SESSION',
    title: `Live Class Scheduled: ${lesson.title}`,
    message: `Join us on ${format(lesson.scheduledAt, 'PPpp')}`,
    link: `/dashboard/courses/${courseId}?lessonId=${lesson.id}`
  }
});
```

### 10. Testing Checklist
- [ ] Admin can create lesson with live link
- [ ] Admin can schedule lesson
- [ ] Student sees countdown for scheduled lesson
- [ ] Student can click "Join Live Class"
- [ ] Admin can update lesson with YouTube video ID
- [ ] Admin can change status to RECORDED/PUBLISHED
- [ ] Student sees embedded video player
- [ ] No teacher routes accessible
- [ ] Register only shows STUDENT option

### 11. Deployment
- [ ] Push schema changes
- [ ] Run `prisma db push` on Vercel (via env)
- [ ] Verify no teacher routes in production
- [ ] Test full flow

## 🗑️ FILES TO DELETE

- `/frontend/src/app/teacher/` (✅ DELETED)
- `/frontend/src/app/admin/submissions/page.tsx` (optional - can convert to reports)
- Any teacher-related API routes

## ⚠️ IMPORTANT NOTES

1. **No YouTube API**: Admin manually uploads to YouTube and pastes video ID
2. **No Automation**: Live links created externally (Google Meet/Zoom)
3. **Simple Flow**: Admin controls everything manually
4. **Two Roles Only**: ADMIN and STUDENT  
5. **Status Flow**: SCHEDULED → LIVE (optional) → RECORDED → PUBLISHED

## 📝 ADMIN WORKFLOW

1. Admin creates lesson, sets status=SCHEDULED
2. Admin adds liveLink (Google Meet URL) and scheduledAt
3. Students see countdown and "Join Live" button
4. Live class happens externally
5. Admin uploads recording to YouTube (unlisted)
6. Admin edits lesson: adds youtubeVideoId, sets status=PUBLISHED
7. Students see embedded video

## Next Command to Run

```bash
cd frontend
npx prisma db push
npx prisma generate
```
