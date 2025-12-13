export interface AttendanceData {
  code: number;
  message: string;
  data: {
    time: {
      weekTotal: string;
      weeks: Array<{
        time: string;
        week: number;
        attendance: string;
        current: boolean;
      }>;
      status: {
        type: string;
        icon: string;
        message: string;
      } | null;
    };
    info: {
      plan_name: string;
      registered: boolean;
    };
    term: {
      start: number;
      end: number;
      exempt: string;
      attended: number;
      require: number;
      passed: boolean;
      message: string;
    };
    table: {
      sessionTime: number;
      sessionStart: string;
      sessionEnd: string;
      afkTime: string;
    }[];
  };
}
