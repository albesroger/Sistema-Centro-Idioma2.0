export interface BaseTask {
  task_id: number;
  task_type?: string;
  team: string;
  date: Date;
  name_of_item_writer: string;
}

export interface ListeningTask extends BaseTask {
  task_type: 'listening';
  text_source: string;
  where_found: string;
  authenticity: string;
  text_input_type: string;
  discourse_type: string;
  main_topic_area: string;
  nature_of_content: string;
  vocabulary: string;
  grammar: string;
  length_of_input: string;
  number_of_participants: number;
  accents: string;
  speed_of_delivery: string;
  clarity_of_articulation: string;
  comprehensible_cefr_level: string;
  item_characteristics: string;
  time_to_do_total_task_minutes: number;
  task_level_estimated: string;
  test_task: string;
  answer_key: string;
  comments: string;
  feedback_provided_by: string;
  feedback_team: string;
  feedback_date: string;
  feedback_text: string;
}

export interface ReadingTask extends BaseTask {
  task_type: 'reading';
  text_source: string;
  where_found: string;
  authenticity: string;
  text_type: string;
  form: string;
  discourse_type: string;
  main_topic_area: string;
  nature_of_content: string;
  vocabulary: string;
  grammar: string;
  number_of_words: number;
  comprehensible_cefr_level: string;
  item_characteristics: string;
  time_to_do_total_task_minutes: number;
  task_level_estimated: string;
  test_task: string;
  answer_key: string;
  comments: string;
  feedback_provided_by: string;
  feedback_team: string;
  feedback_date: string;
  feedback_text: string;
}

export interface WritingTask extends BaseTask {
  task_type: 'writing';
  section: string;
  main_topic_area: string;
  nature_of_content: string;
  expected_vocabulary: string;
  prompt_type: string;
  time_to_do_total_task_minutes: number;
  task_level_estimated: string;
  targetted_outcomes: string;
  task_section_task: string;
  comments: string;
  feedback_provided_by: string;
  feedback_team: string;
  feedback_date: string;
  feedback_text: string;
}

export interface SpeakingTask extends BaseTask {
  task_type: 'speaking';
  original_task_name: string;
  main_topic_area: string;
  nature_of_content: string;
  expected_vocabulary: string;
  prompt_type: string;
  time_to_do_total_task_minutes: number;
  task_level_estimated: string;
  expected_outcomes: string;
  test_task: string;
  comments: string;
  feedback_provided_by: string;
  feedback_team: string;
  feedback_date: string;
  feedback_text: string;
}

export type Task = ListeningTask | ReadingTask | WritingTask | SpeakingTask;
