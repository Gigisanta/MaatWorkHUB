"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@maatwork/ui";
import { updateLeadStatus } from "../lead-actions";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: "new" | "contacted" | "proposal" | "won" | "lost";
  value: string | null;
  notes: string | null;
  createdAt: Date | null;
}

const STAGES = [
  { id: "new", title: "New Leads" },
  { id: "contacted", title: "Contacted" },
  { id: "proposal", title: "Proposal Sent" },
  { id: "won", title: "Closed Won" },
];

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads || []);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    
    if (id) {
      // Optimistic update
      const prevLeads = [...leads];
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: stageId as any } : l)));
      
      const result = await updateLeadStatus(id, stageId as any);
      
      if (!result.success) {
        setLeads(prevLeads);
        toast.error("Error al actualizar estado del lead");
      } else {
        toast.success("Lead actualizado correctamente");
      }
    }
    setDraggedLeadId(null);
  };

  return (
    <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
      {STAGES.map((stage) => (
        <div
          key={stage.id}
          className="flex-1 min-w-[300px] bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col gap-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white/40">{stage.title}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 font-mono">
              {leads.filter(l => l.status === stage.id).length}
            </span>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            {leads
              .filter((l) => l.status === stage.id)
              .map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className={`cursor-grab active:cursor-grabbing group border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 ${
                    draggedLeadId === lead.id ? "opacity-20 scale-95" : "hover:scale-[1.02]"
                  }`}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-sm font-semibold text-white/90 group-hover:text-primary transition-colors">
                        {lead.name}
                      </CardTitle>
                      {lead.value && (
                        <span className="text-[10px] font-mono text-green-500/80 bg-green-500/5 px-2 py-0.5 rounded-full">
                          +${Number(lead.value).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {lead.company && (
                      <CardDescription className="text-[10px] text-white/30 italic">
                        {lead.company}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-[10px] text-white/20 flex justify-between items-center mt-2 border-t border-white/5 pt-3">
                      <span>#Lead-{lead.id.slice(-4)}</span>
                      <span>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'New'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {leads.filter(l => l.status === stage.id).length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl py-8 opacity-20">
                <p className="text-[10px] italic">Sin leads</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
