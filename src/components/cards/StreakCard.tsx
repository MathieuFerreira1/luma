import { View, Text } from 'react-native';
import { COLORS } from '@/src/constants/theme';

const DAY_NAMES_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_NAMES_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTH_NAMES_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function StreakCard({ streak }: { streak: number }) {
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // 0=Lundi, 6=Dimanche
  const currentMonth = MONTH_NAMES_FULL[today.getMonth()];
  const currentDate = today.getDate();
  
  // Get dates for each day of current week (Monday-based)
  const getWeekDates = () => {
    const dates = [];
    const monday = new Date(today);
    monday.setDate(today.getDate() - todayIndex);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  
  const weekDates = getWeekDates();

  return (
    <View className="bg-card rounded-card p-5 shadow-card mb-6">
      {/* Header: current day left, streak count right */}
      <View className="flex-row justify-between items-center mb-5">
        <View>
          <Text className="text-secondary-text text-xs font-bold uppercase tracking-widest mb-0.5">
            {DAY_NAMES_SHORT[todayIndex]}
          </Text>
          <Text className="text-primary-text text-lg font-bold">
            {currentDate} {currentMonth}
          </Text>
        </View>
        <View className="flex-row items-center">
          <View
            className="flex-row items-center px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${COLORS.brand}14`,
              borderWidth: 1,
              borderColor: `${COLORS.brand}30`,
            }}
          >
            <Text className="text-brand text-base font-bold mr-1">{streak}</Text>
            <Text className="text-sm">🔥</Text>
          </View>
        </View>
      </View>

      {/* Days of the week */}
      <View className="flex-row justify-between items-center">
        {DAY_NAMES_SHORT.map((name, index) => {
          const isToday = index === todayIndex;
          const daysAgo = todayIndex - index;
          const isCompleted = index <= todayIndex && daysAgo < streak;
          const dateNum = weekDates[index].getDate();
          const isCurrentMonth = weekDates[index].getMonth() === today.getMonth();

          let status: 'completed' | 'today' | 'upcoming' = 'upcoming';
          if (isCompleted) status = 'completed';
          else if (isToday) status = 'today';

          return (
            <View key={name} className="items-center">
              <Text
                className={`text-[10px] font-bold uppercase mb-1 ${
                  isToday ? 'text-brand' : 'text-secondary-text'
                }`}
              >
                {name}
              </Text>

              <View
                className="w-9 h-9 rounded-full items-center justify-center mb-1"
                style={{
                  backgroundColor:
                    status === 'completed'
                      ? `${COLORS.brand}14`
                      : status === 'today'
                      ? COLORS.brand
                      : 'transparent',
                  borderWidth: status === 'upcoming' ? 2 : 0,
                  borderColor: `${COLORS.text.secondary}30`,
                }}
              >
                <Text
                  className={`text-sm font-bold ${
                    status === 'today'
                      ? 'text-white'
                      : status === 'completed'
                      ? 'text-brand'
                      : 'text-secondary-text'
                  }`}
                >
                  {status === 'completed' ? '🔥' : status === 'today' ? '⭐' : dateNum}
                </Text>
              </View>
              
              {/* Month indicator under circle */}
              <Text className="text-[8px] text-secondary-text opacity-60">
                {!isCurrentMonth && MONTH_NAMES_SHORT[weekDates[index].getMonth()]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
