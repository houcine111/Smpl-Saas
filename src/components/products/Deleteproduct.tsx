import { useAction } from "@/hooks/use-action";
import { deleteProductAction } from "@/app/[locale]/product-actions";
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/Button";

export function DeleteProductButton({ productId }: { productId: string }) {
    const action = useAction(deleteProductAction, {
        successMessage: 'Produit supprimé !'
    });

    const handleDelete = async () => {
        if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            await action.execute(productId);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            isLoading={action.isLoading}
            onClick={handleDelete}
            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    )
}