import type {ReactElement} from "react";
import type {BookingStatus} from "@prisma/client";
import {Document, Font, Page, StyleSheet, Text, View, type DocumentProps} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYw.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYw.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 40,
    fontFamily: "Inter",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titleBlock: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#6b7280",
  },
  value: {
    color: "#020617",
  },
  footer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    fontSize: 8,
    color: "#6b7280",
  },
});

export type BookingVoucherInput = {
  tenantName: string;
  tenantSlug: string;
  tenantEmail: string;
  tenantPhone: string;
  bookingNumber: string;
  status: BookingStatus;
  customerName: string;
  customerEmail: string;
  tourTitle: string;
  startDate: string;
  endDate: string;
  seats: number;
  amountFormatted: string;
  meetingPoint: string;
  endPoint: string;
};

export function createBookingVoucherDocument(
  data: BookingVoucherInput,
): ReactElement<DocumentProps> {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{data.tenantName}</Text>
            <Text style={styles.subtitle}>Booking voucher {data.bookingNumber}</Text>
          </View>
          <View>
            <Text style={styles.label}>Contact</Text>
            <Text style={styles.value}>{data.tenantEmail}</Text>
            <Text style={styles.value}>{data.tenantPhone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking details</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Customer</Text>
              <Text style={styles.value}>{data.customerName}</Text>
              <Text style={styles.value}>{data.customerEmail}</Text>
            </View>
            <View>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{data.status}</Text>
              <Text style={styles.label}>Guests</Text>
              <Text style={styles.value}>{data.seats}</Text>
            </View>
            <View>
              <Text style={styles.label}>Total amount</Text>
              <Text style={styles.value}>{data.amountFormatted}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tour</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{data.tourTitle}</Text>
            </View>
            <View>
              <Text style={styles.label}>Travel dates</Text>
              <Text style={styles.value}>
                {data.startDate} – {data.endDate}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting and end points</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Meeting point</Text>
              <Text style={styles.value}>{data.meetingPoint}</Text>
            </View>
            <View>
              <Text style={styles.label}>End point</Text>
              <Text style={styles.value}>{data.endPoint}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important information</Text>
          <Text>
            Please arrive at the meeting point at least 15 minutes before the scheduled start
            time. Bring a copy of this voucher and a valid photo ID for each guest. For any
            questions or changes, contact your operator directly using the details above.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Generated for {data.tenantSlug}.tripsaas.com · This voucher confirms your booking
            with the operator listed above.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
