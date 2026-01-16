import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Gem, AlertTriangle, ShieldCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Asset {
    id: string;
    institution: string;
    type: string;
    value: string;
    status: string;
    metadata: string;
    requirements: string;
}

const columnHelper = createColumnHelper<Asset>();

const Assets = () => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: assets, isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/estates/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            return data.success ? data.estate.assets : [];
        }
    });

    const columns = useMemo(() => [
        columnHelper.accessor('institution', {
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Institution
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: info => (
                <div className="flex items-center gap-3 font-medium">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Gem className="w-4 h-4 text-blue-600" />
                    </div>
                    {info.getValue()}
                </div>
            )
        }),
        columnHelper.accessor('type', {
            header: "Type",
            cell: info => <Badge variant="outline">{info.getValue()}</Badge>
        }),
        columnHelper.accessor('status', {
            header: "Status",
            cell: info => {
                const status = info.getValue().toUpperCase();
                let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";

                if (status === 'DISTRIBUTED') variant = "default"; // Greenish usually
                if (status === 'CONTACTED') variant = "secondary"; // Yellowish usually

                return <Badge variant={variant}>{status}</Badge>
            }
        }),
        columnHelper.accessor('value', {
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Value
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: info => {
                const val = parseFloat(info.getValue());
                return <div className="text-right font-mono font-medium">${val.toLocaleString()}</div>
            }
        }),
    ], []);

    const table = useReactTable({
        data: assets || [],
        columns,
        // eslint-disable-next-line react-hooks/incompatible-library
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    const totalValue = assets?.reduce((acc: number, curr: Asset) => acc + parseFloat(curr.value || '0'), 0) || 0;
    const probateThreshold = 184500;
    const isProbateLikely = totalValue > probateThreshold;

    if (isLoading) {
        return (
            <div className="p-8 max-w-6xl mx-auto space-y-4">
                <Skeleton className="h-12 w-[300px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Asset Inventory</h1>
                    <p className="text-muted-foreground">Manage and track all estate assets in one place.</p>
                </div>
                <Card className={isProbateLikely ? "border-orange-200 bg-orange-50" : "border-emerald-200 bg-emerald-50"}>
                    <CardContent className="p-4 flex items-center gap-4">
                        {isProbateLikely ? <AlertTriangle className="text-orange-600" /> : <ShieldCheck className="text-emerald-600" />}
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Gross Estate Value</p>
                            <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
                            {isProbateLikely && <p className="text-xs text-orange-700 font-medium">Exceeds Small Estate Limit</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recorded Assets</CardTitle>
                    <CardDescription>
                        A list of all assets currently tracked in the estate.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No assets found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Assets;
