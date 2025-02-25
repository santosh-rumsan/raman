import AdminLayout from '@/layouts/admin/layout';
import { AccountList } from '@/sections/accounts/list';

export default function Page() {
    return (
        <AdminLayout title="Accounts">
            <AccountList />
        </AdminLayout>
    );
}
