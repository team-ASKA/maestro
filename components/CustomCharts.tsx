import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface LineData {
  labels: string[];
  values: number[];
}

export function CustomBarChart({ data, maxValue }: { data: BarData[]; maxValue: number }) {
  return (
    <View style={styles.barChartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barItem}>
          <View style={styles.barColumn}>
            <View
              style={[
                styles.bar,
                {
                  height: (item.value / maxValue) * 120,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
          <Text style={styles.barLabel}>{item.label}</Text>
          <Text style={styles.barValue}>₹{(item.value / 100000).toFixed(1)}L</Text>
        </View>
      ))}
    </View>
  );
}

export function CustomPieChart({ data }: { data: PieData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <View style={styles.pieChartContainer}>
      <View style={styles.pieChart}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <View key={index} style={styles.pieSlice}>
              <View
                style={[
                  styles.pieColor,
                  { backgroundColor: item.color, width: `${percentage}%` },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.pieLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendValue}>₹{(item.value / 100000).toFixed(1)}L</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function CustomLineChart({ data }: { data: LineData }) {
  const maxValue = Math.max(...data.values);
  
  return (
    <View style={styles.lineChartContainer}>
      <View style={styles.lineChart}>
        <View style={styles.lineGrid}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.gridLine} />
          ))}
        </View>
        <View style={styles.linePath}>
          {data.values.map((value, index) => (
            <View key={index} style={styles.linePoint}>
              <View
                style={[
                  styles.point,
                  {
                    bottom: (value / maxValue) * 100,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.lineLabels}>
        {data.labels.map((label, index) => (
          <Text key={index} style={styles.lineLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function ActivityGrid({ activities }: { activities: Array<{ date: string; count: number }> }) {
  const maxCount = Math.max(...activities.map(a => a.count));
  
  return (
    <View style={styles.activityGrid}>
      <Text style={styles.activityTitle}>Quest Activity (Last 14 Days)</Text>
      <View style={styles.activityContainer}>
        {activities.map((activity, index) => (
          <View
            key={index}
            style={[
              styles.activityCell,
              {
                backgroundColor: activity.count === 0 
                  ? '#f0f0f0' 
                  : `rgba(16, 185, 129, ${activity.count / maxCount})`,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.activityLegend}>
        <Text style={styles.activityLegendText}>Less</Text>
        <View style={styles.activityLegendColors}>
          {[0, 0.25, 0.5, 0.75, 1].map((opacity, index) => (
            <View
              key={index}
              style={[
                styles.activityLegendColor,
                { backgroundColor: opacity === 0 ? '#f0f0f0' : `rgba(16, 185, 129, ${opacity})` },
              ]}
            />
          ))}
        </View>
        <Text style={styles.activityLegendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Bar Chart Styles
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 10,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barColumn: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000000',
  },
  barLabel: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
  },
  barValue: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Pie Chart Styles
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#000000',
    marginBottom: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  pieSlice: {
    height: '100%',
  },
  pieColor: {
    height: '100%',
  },
  pieLegend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  legendText: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  legendValue: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
  },

  // Line Chart Styles
  lineChartContainer: {
    height: 160,
  },
  lineChart: {
    height: 120,
    position: 'relative',
    marginBottom: 20,
  },
  lineGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  linePath: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 10,
  },
  linePoint: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#000000',
    position: 'absolute',
  },
  lineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  lineLabel: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Activity Grid Styles
  activityGrid: {
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },
  activityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 100,
    justifyContent: 'center',
    marginBottom: 15,
  },
  activityCell: {
    width: 12,
    height: 12,
    margin: 1,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activityLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activityLegendText: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
  },
  activityLegendColors: {
    flexDirection: 'row',
    gap: 2,
  },
  activityLegendColor: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});
