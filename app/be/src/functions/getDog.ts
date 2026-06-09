import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
// 1. インポートの書き方をデフォルトインポートに変更
import mongoose from "mongoose";

// TypeScript用のドキュメントインターフェースを定義
interface IDog {
    id: number;
    name: string;
    breed: string;
}

// NoSQLのデータ構造（スキーマ）を定義
const DogSchema = new mongoose.Schema<IDog>({
    id: Number,
    name: String,
    breed: String
});

// "inu" というコレクション（テーブル）を指定（型キャストで安全にモデルを参照）
const Dog = (mongoose.models.Dog as mongoose.Model<IDog>) || mongoose.model<IDog>("Dog", DogSchema, "inu");

// データベース接続関数
async function connectDB() {
    // 2. 一度変数に受けてから安全に接続ステータスをチェック
    const conn = mongoose.connection;
    
    if (!conn || conn.readyState === 0) {
        // network_mode: service:db のため localhost で通信可能
        await mongoose.connect("mongodb://localhost:27017/inudb");
        
        // 初回起動時、データが空っぽなら初期データを自動投入
        const count = await Dog.countDocuments();
        if (count === 0) {
            await Dog.insertMany([
                { id: 1, name: "ポチ", breed: "しば" },
                { id: 2, name: "ウメ", breed: "マルチーズ" },
                { id: 3, name: "タロウ", breed: "まめしば" },
                { id: 4, name: "マサオ", breed: "秋田犬" },
                { id: 5, name: "レモ", breed: "ゴールデンリトリバー" }
            ]);
        }
    }
}

// 戻り値の型を Promise<HttpResponseInit> に修正
export async function getDog(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        await connectDB();
        
        // URLのパラメータから "?name=ポチ" のように名前を取得
        const name = request.query.get('name');

        if (!name) {
            return { status: 400, body: "名前を指定してください。" };
        }

        // データベースから一致する犬を検索
        const dog = await Dog.findOne({ name: name });

        if (dog) {
            return {
                status: 200,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" // フロントエンドからのアクセスを許可
                },
                body: JSON.stringify({ success: true, breed: dog.breed })
            };
        } else {
            return {
                status: 200,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" 
                },
                body: JSON.stringify({ success: false })
            };
        }
    } catch (error: any) {
        return { status: 500, body: `エラーが発生しました: ${error.message}` };
    }
}

app.http('getDog', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getDog
});