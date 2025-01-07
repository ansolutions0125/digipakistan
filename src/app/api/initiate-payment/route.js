export default async function handler(req,res){
    if(req.method !== "POST") return new Response(JSON.stringify("Method not allowed"),{status:405});

    const payload = await req.body();
    const {websiteId,requestedPaymentGateway,user,price,} = payload;
    if (!websiteId || !requestedPaymentGateway || !user || !price) {
        return new Response(JSON.stringify("Error Here"),{status:405});
      }
     
}