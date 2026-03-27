-- ============================================
-- Phase 4: profilesにbioカラム、videosにview_countカラムを追加
-- ============================================

-- profiles に bio カラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';

-- videos に view_count カラムを追加
ALTER TABLE videos ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
