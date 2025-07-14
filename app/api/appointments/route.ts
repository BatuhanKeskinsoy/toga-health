import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialistId = searchParams.get('specialistId');
    const addressId = searchParams.get('addressId');
    const isHospital = searchParams.get('isHospital') === 'true';
    

    
    // Simüle edilmiş randevu verisi
    // Doktor bazlı randevu verisi
    const doctorAppointmentsData = {
      "dr-001": {
        addresses: {
          "addr-001": {
            schedules: [
              {
                date: "2025-07-14",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "17:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-15",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "17:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: false, isBooked: true },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-16",
                dayOfWeek: 3,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "17:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-17",
                dayOfWeek: 4,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-18",
                dayOfWeek: 5,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "17:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: false, isBooked: true },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-19",
                dayOfWeek: 6,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "13:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-20",
                dayOfWeek: 0,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-21",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "17:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-22",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:00", end: "17:00" },
                timeSlots: [
                  { time: "08:00", isAvailable: false, isBooked: true },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false }
                ]
              }
            ]
          },
          "addr-004": {
            schedules: [
              {
                date: "2025-07-14",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "18:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true },
                  { time: "17:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-15",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "18:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-16",
                dayOfWeek: 3,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "18:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-17",
                dayOfWeek: 4,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "18:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-18",
                dayOfWeek: 5,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-19",
                dayOfWeek: 6,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "14:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-20",
                dayOfWeek: 0,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-21",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "18:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-22",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "09:00", end: "18:00" },
                timeSlots: [
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: true, isBooked: false }
                ]
              }
            ]
          },
          "addr-005": {
            schedules: [
              {
                date: "2025-07-14",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "19:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: false, isBooked: true },
                  { time: "18:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-15",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "19:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-16",
                dayOfWeek: 3,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "19:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-17",
                dayOfWeek: 4,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "19:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-18",
                dayOfWeek: 5,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-19",
                dayOfWeek: 6,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "15:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-20",
                dayOfWeek: 0,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-21",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "19:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-22",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "10:00", end: "19:00" },
                timeSlots: [
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: true, isBooked: false }
                ]
              }
            ]
          }
        }
      },
      "dr-002": {
        addresses: {
          "addr-001": {
            schedules: [
              {
                date: "2025-07-14",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "20:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: false, isBooked: true },
                  { time: "19:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-15",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "20:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: false, isBooked: true },
                  { time: "18:00", isAvailable: true, isBooked: false },
                  { time: "19:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-16",
                dayOfWeek: 3,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "20:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: true, isBooked: false },
                  { time: "19:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-17",
                dayOfWeek: 4,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "20:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: false, isBooked: true },
                  { time: "18:00", isAvailable: true, isBooked: false },
                  { time: "19:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-18",
                dayOfWeek: 5,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-19",
                dayOfWeek: 6,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "16:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true },
                  { time: "16:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-20",
                dayOfWeek: 0,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-21",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "20:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: false, isBooked: true },
                  { time: "17:00", isAvailable: true, isBooked: false },
                  { time: "18:00", isAvailable: true, isBooked: false },
                  { time: "19:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-22",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "11:00", end: "20:00" },
                timeSlots: [
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false },
                  { time: "16:00", isAvailable: true, isBooked: false },
                  { time: "17:00", isAvailable: false, isBooked: true },
                  { time: "18:00", isAvailable: true, isBooked: false },
                  { time: "19:00", isAvailable: true, isBooked: false }
                ]
              }
            ]
          },
          "addr-004": {
            schedules: [
              {
                date: "2025-07-14",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "17:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: true, isBooked: false },
                  { time: "09:30", isAvailable: false, isBooked: true },
                  { time: "10:30", isAvailable: true, isBooked: false },
                  { time: "11:30", isAvailable: true, isBooked: false },
                  { time: "12:30", isAvailable: false, isBooked: true },
                  { time: "13:30", isAvailable: true, isBooked: false },
                  { time: "14:30", isAvailable: true, isBooked: false },
                  { time: "15:30", isAvailable: false, isBooked: true },
                  { time: "16:30", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-15",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "17:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: false, isBooked: true },
                  { time: "09:30", isAvailable: true, isBooked: false },
                  { time: "10:30", isAvailable: true, isBooked: false },
                  { time: "11:30", isAvailable: false, isBooked: true },
                  { time: "12:30", isAvailable: true, isBooked: false },
                  { time: "13:30", isAvailable: true, isBooked: false },
                  { time: "14:30", isAvailable: false, isBooked: true },
                  { time: "15:30", isAvailable: true, isBooked: false },
                  { time: "16:30", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-16",
                dayOfWeek: 3,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "17:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: true, isBooked: false },
                  { time: "09:30", isAvailable: true, isBooked: false },
                  { time: "10:30", isAvailable: false, isBooked: true },
                  { time: "11:30", isAvailable: true, isBooked: false },
                  { time: "12:30", isAvailable: true, isBooked: false },
                  { time: "13:30", isAvailable: false, isBooked: true },
                  { time: "14:30", isAvailable: true, isBooked: false },
                  { time: "15:30", isAvailable: true, isBooked: false },
                  { time: "16:30", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-17",
                dayOfWeek: 4,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "17:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: false, isBooked: true },
                  { time: "09:30", isAvailable: true, isBooked: false },
                  { time: "10:30", isAvailable: true, isBooked: false },
                  { time: "11:30", isAvailable: false, isBooked: true },
                  { time: "12:30", isAvailable: true, isBooked: false },
                  { time: "13:30", isAvailable: true, isBooked: false },
                  { time: "14:30", isAvailable: false, isBooked: true },
                  { time: "15:30", isAvailable: true, isBooked: false },
                  { time: "16:30", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-18",
                dayOfWeek: 5,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-19",
                dayOfWeek: 6,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "13:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: true, isBooked: false },
                  { time: "09:30", isAvailable: false, isBooked: true },
                  { time: "10:30", isAvailable: true, isBooked: false },
                  { time: "11:30", isAvailable: true, isBooked: false },
                  { time: "12:30", isAvailable: false, isBooked: true },
                  { time: "13:30", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-20",
                dayOfWeek: 0,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-21",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "17:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: true, isBooked: false },
                  { time: "09:30", isAvailable: true, isBooked: false },
                  { time: "10:30", isAvailable: false, isBooked: true },
                  { time: "11:30", isAvailable: true, isBooked: false },
                  { time: "12:30", isAvailable: true, isBooked: false },
                  { time: "13:30", isAvailable: false, isBooked: true },
                  { time: "14:30", isAvailable: true, isBooked: false },
                  { time: "15:30", isAvailable: true, isBooked: false },
                  { time: "16:30", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-22",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "08:30", end: "17:30" },
                timeSlots: [
                  { time: "08:30", isAvailable: false, isBooked: true },
                  { time: "09:30", isAvailable: true, isBooked: false },
                  { time: "10:30", isAvailable: true, isBooked: false },
                  { time: "11:30", isAvailable: false, isBooked: true },
                  { time: "12:30", isAvailable: true, isBooked: false },
                  { time: "13:30", isAvailable: true, isBooked: false },
                  { time: "14:30", isAvailable: false, isBooked: true },
                  { time: "15:30", isAvailable: true, isBooked: false },
                  { time: "16:30", isAvailable: true, isBooked: false }
                ]
              }
            ]
          },
          "addr-006": {
            schedules: [
              {
                date: "2025-07-14",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "16:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: true, isBooked: false },
                  { time: "08:00", isAvailable: false, isBooked: true },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: false, isBooked: true },
                  { time: "15:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-15",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "16:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: false, isBooked: true },
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-16",
                dayOfWeek: 3,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "16:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: true, isBooked: false },
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-17",
                dayOfWeek: 4,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "16:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: false, isBooked: true },
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-18",
                dayOfWeek: 5,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-19",
                dayOfWeek: 6,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "12:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: true, isBooked: false },
                  { time: "08:00", isAvailable: false, isBooked: true },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: false, isBooked: true },
                  { time: "12:00", isAvailable: true, isBooked: false }
                ]
              },
              {
                date: "2025-07-20",
                dayOfWeek: 0,
                isHoliday: true,
                isWorkingDay: false,
                workingHours: null,
                timeSlots: []
              },
              {
                date: "2025-07-21",
                dayOfWeek: 1,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "16:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: true, isBooked: false },
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: false, isBooked: true },
                  { time: "10:00", isAvailable: true, isBooked: false },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: false, isBooked: true },
                  { time: "13:00", isAvailable: true, isBooked: false },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: false, isBooked: true }
                ]
              },
              {
                date: "2025-07-22",
                dayOfWeek: 2,
                isHoliday: false,
                isWorkingDay: true,
                workingHours: { start: "07:00", end: "16:00" },
                timeSlots: [
                  { time: "07:00", isAvailable: false, isBooked: true },
                  { time: "08:00", isAvailable: true, isBooked: false },
                  { time: "09:00", isAvailable: true, isBooked: false },
                  { time: "10:00", isAvailable: false, isBooked: true },
                  { time: "11:00", isAvailable: true, isBooked: false },
                  { time: "12:00", isAvailable: true, isBooked: false },
                  { time: "13:00", isAvailable: false, isBooked: true },
                  { time: "14:00", isAvailable: true, isBooked: false },
                  { time: "15:00", isAvailable: true, isBooked: false }
                ]
              }
            ]
          }
        }
      }
    };

    // Genel randevu verisi (specialist sayfası için)
    const appointmentsData = {
      addresses: {
        "addr-001": {
          schedules: [
            {
              date: "2025-07-14",
              dayOfWeek: 1,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "09:00",
                end: "18:00"
              },
              timeSlots: [
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: false, isBooked: true },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: false, isBooked: true },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: true, isBooked: false },
                { time: "16:00", isAvailable: false, isBooked: true },
                { time: "17:00", isAvailable: true, isBooked: false },
                { time: "18:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-15",
              dayOfWeek: 2,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "09:00",
                end: "18:00"
              },
              timeSlots: [
                { time: "09:00", isAvailable: false, isBooked: true },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: false, isBooked: true },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: false, isBooked: true },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: true, isBooked: false },
                { time: "18:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-16",
              dayOfWeek: 3,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "09:00",
                end: "18:00"
              },
              timeSlots: [
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: false, isBooked: true },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: false, isBooked: true },
                { time: "15:00", isAvailable: true, isBooked: false },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: false, isBooked: true },
                { time: "18:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-17",
              dayOfWeek: 4,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "09:00",
                end: "18:00"
              },
              timeSlots: [
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: false, isBooked: true },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: false, isBooked: true },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: true, isBooked: false },
                { time: "16:00", isAvailable: false, isBooked: true },
                { time: "17:00", isAvailable: true, isBooked: false },
                { time: "18:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-18",
              dayOfWeek: 5,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "09:00",
                end: "13:00"
              },
              timeSlots: [
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: false, isBooked: true },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: false, isBooked: true }
              ]
            },
            {
              date: "2025-07-19",
              dayOfWeek: 6,
              isHoliday: true,
              isWorkingDay: false,
              workingHours: null,
              timeSlots: []
            },
            {
              date: "2025-07-20",
              dayOfWeek: 0,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "09:00",
                end: "18:00"
              },
              timeSlots: [
                { time: "09:00", isAvailable: false, isBooked: true },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: false, isBooked: true },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: false, isBooked: true },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: true, isBooked: false },
                { time: "18:00", isAvailable: true, isBooked: false }
              ]
            }
          ]
        },
        "addr-002": {
          schedules: [
            {
              date: "2025-07-14",
              dayOfWeek: 1,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "08:00",
                end: "17:00"
              },
              timeSlots: [
                { time: "08:00", isAvailable: false, isBooked: true },
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: false, isBooked: true },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: false, isBooked: true },
                { time: "15:00", isAvailable: true, isBooked: false },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: false, isBooked: true }
              ]
            },
            {
              date: "2025-07-15",
              dayOfWeek: 2,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "08:00",
                end: "17:00"
              },
              timeSlots: [
                { time: "08:00", isAvailable: true, isBooked: false },
                { time: "09:00", isAvailable: false, isBooked: true },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: false, isBooked: true },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: false, isBooked: true },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-16",
              dayOfWeek: 3,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "08:00",
                end: "17:00"
              },
              timeSlots: [
                { time: "08:00", isAvailable: true, isBooked: false },
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: false, isBooked: true },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: false, isBooked: true },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: true, isBooked: false },
                { time: "16:00", isAvailable: false, isBooked: true },
                { time: "17:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-17",
              dayOfWeek: 4,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "08:00",
                end: "17:00"
              },
              timeSlots: [
                { time: "08:00", isAvailable: true, isBooked: false },
                { time: "09:00", isAvailable: false, isBooked: true },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: false, isBooked: true },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: true, isBooked: false },
                { time: "15:00", isAvailable: false, isBooked: true },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-18",
              dayOfWeek: 5,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "08:00",
                end: "13:00"
              },
              timeSlots: [
                { time: "08:00", isAvailable: true, isBooked: false },
                { time: "09:00", isAvailable: false, isBooked: true },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: true, isBooked: false },
                { time: "12:00", isAvailable: false, isBooked: true },
                { time: "13:00", isAvailable: true, isBooked: false }
              ]
            },
            {
              date: "2025-07-19",
              dayOfWeek: 6,
              isHoliday: true,
              isWorkingDay: false,
              workingHours: null,
              timeSlots: []
            },
            {
              date: "2025-07-20",
              dayOfWeek: 0,
              isHoliday: false,
              isWorkingDay: true,
              workingHours: {
                start: "08:00",
                end: "17:00"
              },
              timeSlots: [
                { time: "08:00", isAvailable: false, isBooked: true },
                { time: "09:00", isAvailable: true, isBooked: false },
                { time: "10:00", isAvailable: true, isBooked: false },
                { time: "11:00", isAvailable: false, isBooked: true },
                { time: "12:00", isAvailable: true, isBooked: false },
                { time: "13:00", isAvailable: true, isBooked: false },
                { time: "14:00", isAvailable: false, isBooked: true },
                { time: "15:00", isAvailable: true, isBooked: false },
                { time: "16:00", isAvailable: true, isBooked: false },
                { time: "17:00", isAvailable: false, isBooked: true }
              ]
            }
          ]
        }
      }
    };

    // Hastane sayfasında doktor seçilmişse doktor bazlı veriyi döndür
    if (specialistId && isHospital) {
      const doctorData = doctorAppointmentsData[specialistId as keyof typeof doctorAppointmentsData];
      if (doctorData && addressId) {
        const addressData = doctorData.addresses[addressId as keyof typeof doctorData.addresses];
        if (addressData) {
          return NextResponse.json({ addresses: { [addressId]: addressData } });
        }
      }
    }

    // Specialist sayfasında doktor bazlı veriyi döndür
    if (specialistId && !isHospital) {
      const doctorData = doctorAppointmentsData[specialistId as keyof typeof doctorAppointmentsData];
      if (doctorData && addressId) {
        const addressData = doctorData.addresses[addressId as keyof typeof doctorData.addresses];
        if (addressData) {
          return NextResponse.json({ addresses: { [addressId]: addressData } });
        }
      }
    }

    // Genel veriyi döndür
    return NextResponse.json(appointmentsData);

    return NextResponse.json(appointmentsData);
  } catch (error) {
    console.error('Appointments API Error:', error);
    return NextResponse.json(
      { error: 'Randevu bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 