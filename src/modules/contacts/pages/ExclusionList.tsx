import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ExclusionEntry {
  id: string;
  identifier: string;
  identifier_type: string;
  reason: string | null;
  created_at: string;
}

const ExclusionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    identifier: "",
    identifier_type: "phone",
    reason: "",
  });
  const queryClient = useQueryClient();

  const { data: exclusionList, isLoading } = useQuery({
    queryKey: ["exclusion-list"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("exclusion_list")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExclusionEntry[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (entry: typeof newEntry) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("exclusion_list")
        .insert({
          user_id: user.id,
          identifier: entry.identifier,
          identifier_type: entry.identifier_type,
          reason: entry.reason || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exclusion-list"] });
      toast.success("Contato adicionado à lista de exclusão");
      setIsDialogOpen(false);
      setNewEntry({ identifier: "", identifier_type: "phone", reason: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao adicionar contato");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("exclusion_list")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exclusion-list"] });
      toast.success("Contato removido da lista de exclusão");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover contato");
    },
  });

  const filteredList = exclusionList?.filter((entry) =>
    entry.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.identifier.trim()) {
      toast.error("Preencha o campo de identificação");
      return;
    }
    addMutation.mutate(newEntry);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Lista de Exclusão</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Contato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar à Lista de Exclusão</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="identifier_type">Tipo de Identificação</Label>
                  <Select
                    value={newEntry.identifier_type}
                    onValueChange={(value) =>
                      setNewEntry({ ...newEntry, identifier_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="identifier">
                    {newEntry.identifier_type === "phone" ? "Telefone" : "Email"}
                  </Label>
                  <Input
                    id="identifier"
                    placeholder={
                      newEntry.identifier_type === "phone"
                        ? "Ex: 11999999999"
                        : "Ex: contato@email.com"
                    }
                    value={newEntry.identifier}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, identifier: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ex: Solicitou não receber mais comunicações"
                    value={newEntry.reason}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, reason: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Adicionando..." : "Adicionar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : filteredList && filteredList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Identificação</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {entry.identifier_type === "phone" ? "Telefone" : "Email"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.identifier}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.reason || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Nenhum contato encontrado"
                : "Nenhum contato na lista de exclusão"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExclusionList;
