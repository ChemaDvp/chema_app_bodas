export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

type Wedding = {
  id: string
  partner_names: string
  wedding_date: string | null
  venue: string | null
  location: string | null
  description: string | null
  details: Json
  created_at: string
}

type Song = {
  id: string
  wedding_id: string
  title: string
  artist: string
  kind: 'must_play' | 'do_not_play'
  added_by: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

type ScheduleItem = {
  id: string
  wedding_id: string
  event_time: string
  title: string
  description: string | null
  position: number
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      user_roles: Table<
        { user_id: string; role: 'admin' | 'couple' },
        { user_id: string; role: 'admin' | 'couple' }
      >
      weddings: Table<
        Wedding,
        Omit<Wedding, 'id' | 'created_at' | 'details'> & { id?: string; created_at?: string; details?: Json }
      >
      wedding_members: Table<
        { wedding_id: string; user_id: string },
        { wedding_id: string; user_id: string }
      >
      budgets: Table<
        {
          wedding_id: string
          first_four_hours: number
          dj_equipment: number
          extra_hour: number
          reservation_deposit: number
          travel_expense: number | null
          pdf_path: string | null
          updated_at: string
        },
        {
          wedding_id: string
          first_four_hours?: number
          dj_equipment?: number
          extra_hour?: number
          reservation_deposit?: number
          travel_expense?: number | null
          pdf_path?: string | null
          updated_at?: string
        }
      >
      budget_notes: Table<
        { id: string; wedding_id: string; content: string; position: number },
        { id?: string; wedding_id: string; content: string; position?: number }
      >
      songs: Table<Song, {
        id?: string
        wedding_id: string
        title: string
        artist: string
        kind?: Song['kind']
        added_by: string
        status?: Song['status']
        created_at?: string
      }>
      media_items: Table<
        { id: string; bucket_path: string; media_type: 'image' | 'video'; alt_text: string | null; position: number; active: boolean; created_at: string },
        { id?: string; bucket_path: string; media_type: 'image' | 'video'; alt_text?: string | null; position?: number; active?: boolean; created_at?: string }
      >
      wedding_schedule_items: Table<
        ScheduleItem,
        { id?: string; wedding_id: string; event_time: string; title: string; description?: string | null; position?: number; created_at?: string }
      >
      wedding_invitations: Table<
        { token_hash: string; wedding_id: string; created_by: string; expires_at: string; claimed_by: string | null; claimed_at: string | null; created_at: string },
        never
      >
    }
    Views: Record<string, never>
    Functions: {
      create_wedding_invitation: { Args: { p_wedding_id: string }; Returns: string }
      revoke_wedding_invitations: { Args: { p_wedding_id: string }; Returns: undefined }
      claim_wedding_invitation: { Args: { p_token: string }; Returns: string }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
