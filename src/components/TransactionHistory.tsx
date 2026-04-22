import React from 'react';
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Transaction } from "@/context/types";

interface TransactionHistoryProps {
  transactions: Transaction[];
  title?: string;
}

export function TransactionHistory({ transactions, title = "Recent Transactions" }: TransactionHistoryProps) {
  return (
    <div className="surface-panel overflow-hidden border border-border/50 shadow-sm">
      <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border/50">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  tx.type === 'payment' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                }`}>
                  {tx.type === 'payment' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{tx.counterpartName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-tight text-muted-foreground">{tx.type}</span>
                    <span className="text-xs text-muted-foreground">• {format(new Date(tx.date), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'payment' ? 'text-foreground' : 'text-success'}`}>
                  {tx.type === 'payment' ? '-' : '+'}{tx.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {tx.status === 'completed' && <CheckCircle2 size={12} className="text-success" />}
                  {tx.status === 'pending' && <Clock size={12} className="text-warning" />}
                  {tx.status === 'refunded' && <XCircle size={12} className="text-muted-foreground" />}
                  <span className="text-[10px] capitalize text-muted-foreground font-medium">{tx.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground italic">
            No transaction records found.
          </div>
        )}
      </div>
    </div>
  );
}
