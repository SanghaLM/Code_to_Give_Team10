import { Redirect } from 'expo-router';

export default function TeacherIndex() {
  // Redirect to the default teacher tab (students)
  return <Redirect href="/teacher/students" />;
}
