import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"
import { Sparkles, Camera, Tag, Calculator, Lock, Unlock, Coins, FileText, Info, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import createToken from "@/utils/createToken"

const formSchema = z.object({
  TokenName: z.string().min(2, {
    message: "Token name must be at least 2 characters."
  }).max(20, {
    message: "Token name cannot exceed 20 characters."
  }),
  ImageUrl: z.string().url({
    message: "Please enter a valid URL."
  }),
  InitialSupply: z.number().positive({
    message: "Supply must be a positive number."
  }),
  Symbol: z.string().min(2, {
    message: "Symbol must be at least 2 characters."
  }).max(8, {
    message: "Symbol cannot exceed 8 characters."
  }),
  Decimal: z.number().min(0, {
    message: "Decimals must be at least 0."
  }).max(18, {
    message: "Decimals cannot exceed 18."
  }),
  RevokeMint: z.boolean(),
  RevokeFreeze: z.boolean(),
  Description: z.string().min(8, {
    message: "Description must be at least 8 characters."
  }).max(50, {
    message: "Description cannot exceed 50 characters."
  })
})

export type FormSchema = z.infer<typeof formSchema>

const TokenLaunchpadForm = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TokenName: "",
      ImageUrl: "",
      InitialSupply: 1000,
      Symbol: "",
      Decimal: 9,
      RevokeMint: false,
      RevokeFreeze: false,
      Description: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)
    setTokenAddress(null)

    try {
      const mintAddress = await createToken(connection, publicKey, values, sendTransaction)
      toast.success("Token created successfully!")
      setTokenAddress(mintAddress)
      form.reset()
    } catch (error) {
      console.error("Error creating token:", error)
      toast.error("Failed to create token. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-6 border-b border-border/50">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Create Your Token</h1>
        </div>
        <p className="text-center text-white/80 mt-2">Launch your own token on Solana blockchain</p>
      </CardHeader>

      <CardContent className="p-6">
        {tokenAddress && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Token Created!</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="font-medium">Your token has been successfully created.</div>
              <div className="mt-2 text-sm">
                <span className="font-semibold">Token Address:</span>
                <code className="ml-2 p-1 bg-green-500/20 rounded">{tokenAddress}</code>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="TokenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        Token Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Awesome Token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Symbol
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MAT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="InitialSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Initial Supply
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1000000"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your token (8-50 chars)"
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        <span>{field.value.length}/50 characters</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="ImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Use a square image for best results</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Decimal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Decimals
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 9"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Standard is 9 decimals for Solana</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 pt-2 mt-4">
                  <FormField
                    control={form.control}
                    name="RevokeMint"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Revoke Mint Authority
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Prevents creating more tokens in the future
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RevokeFreeze"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Unlock className="h-4 w-4" />
                            Revoke Freeze Authority
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Prevents freezing holders' token accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              {!publicKey && (
                <Alert className="mb-4 bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Wallet not connected</AlertTitle>
                  <AlertDescription>
                    Please connect your wallet to create a token
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity text-white dark:text-white font-semibold"
                variant="default"
                size="lg"
                disabled={isSubmitting || !publicKey}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creating Token...</span>
                  </div>
                ) : (
                  <span>Launch Token</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="bg-muted/20 p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
        <div className="mb-2 sm:mb-0">
          Token creation will require a transaction fee
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tokens are created on Solana's network</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TokenLaunchpadForm
