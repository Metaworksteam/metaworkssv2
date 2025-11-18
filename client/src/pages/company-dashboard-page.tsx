import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/dashboard-layout';
import CompanyDashboard from '@/components/company/company-dashboard';

export default function CompanyDashboardPage() {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Company Information Dashboard | MetaWorks</title>
      </Helmet>
      <CompanyDashboard />
    </DashboardLayout>
  );
}