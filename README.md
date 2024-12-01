# Papyrus - Decentralized Academic Publishing Platform

A blockchain-based platform revolutionizing academic publishing by creating a transparent, immutable, and accessible research database.

## 吐槽
权威的学术出版机构为前沿学术观点提供了相对公正严谨的平台，在论文发表过程中提供了审稿流程和审稿人邀请机制，在一定程度上保证了学术成果的质量。
但是这种出版模式也饱受诟病。一个非常令人愤慨的事实是，学术期刊两头通吃，既可以从作者那里收取高额的出版费用，又可以从读者那里收取高额的订阅费用。高昂的发表费用客观上抬高了学术成果的门槛，也限制了学术成果的传播。欠发达国家和地区的研究人员由于经济原因，无法订阅昂贵的学术期刊，客观上被排除在学术交流的主流之外。这是不争的事实。

一个非常有趣的问题是，高水平的学术成果是否只有在权威期刊上发表才能获得足够的关注？实际上，很多热点学术成果由于受到广泛关注，往往会选择在arXiv等预印本平台首发，然后再提交到权威期刊发表。其成果的准确性往往会在第一时间得到同行的检验和复现，相比审稿人意见，同行迫不及待的复现意愿往往更能反映成果的影响力。

看来，学术成果的影响力并不取决于它是否发表在权威期刊上，而是取决于它是否具有创新性和影响力。那我们为什么不能创建一个平台，让所有学术成果自由发布，让所有读者自由订阅，让所有学者自由交流呢？

## 项目介绍
本项目来源于[这个帖子](https://x.com/isyiming/status/1858533903000379740)
我将其命名为Papyrus 莎草纸，我问了AI，他告诉我这是古埃及的书写材料，象征着知识的传承和学术的进步。


Papyrus 是构建于solana上的去中心化的学术出版平台，它包括如下模块：
链上合约
    - 论文发布
        - 作者将可以花费少量gas，发布论文到链上，发布内容包括标题、作者、论文原文url、引用文献标识
    - 论文评审
        - 任何人都可以花费少量gas，对论文进行评审，评审分数将作为论文的元数据存储在链上

explorer服务
    - 作者的显示身份认证（邮箱，github账号，twitter账号等）
    - 论文索引、论文搜索、论文阅读、论文评论、论文打赏等功能。

这套系统的经济开销包括：
- 论文作者和评审人支付少量链上gas
- 论文作者对论文原文存储负责，自行承担存储费用，自行选择存储服务商，但是链上的论文原文url可更新，由作者维护。
- explorer服务是中心化的，它提供的论文检索，被引次数统计等功能，需要服务器资源。

## 我对 Papyrus 的预期

我觉得Papyrus可以首先在web3社区内流行起来，成为web3社区内学术交流的基础设施。实际上web3缺少一个严肃观点的交流平台，我们习惯于在X和电报或者广场阅读碎片化的信息，这其中也不乏严肃的学术观点的交流。但是这些信息往往混杂在大量的垃圾信息中，很难被系统性的收集和整理。

我觉得Papyrus非常适合将复杂信息浓缩，沉淀，成为web3社区的智力成果库。比如，中本聪的论文，很多人阅读过，也一定有很多人没有读过。但是其中的观点早已深入人心，凝聚了最广泛的共识。我们一提到中本聪，btc，就会不由自主的将pow，点对点，拜占庭容错，等概念设定在当下语境中。我们在聊到nft时，总是会说erc721。nft相关的大量概念化为一个符号，极大降低了沟通成本。

作为一个kol，研究员，开发者，你会不会期待有一天，你说 "Papyrus-xxx"后，大家就立刻理解你想要表达的观点，无需长篇大论的重复解释。
你想不想在Papyrus上发表你的观点后，得到越来越多的人认同，你的观点最终成为大家口中的"Papyrus-xxx"呢？


## 感兴趣的开发者，欢迎加入

合约代码在：papyrus/programs/papyrus/src/instructions
前端app代码在：papyrus/app/src
explorer服务代码：还没开始写

Papyrus需要：
- 熟悉solana rust的智能合约开发者
- 熟悉react的前端开发者
- 熟悉golang的后端开发者

目前的[效果](https://github.com/yimingWOW/Papyrus/blob/main/image/publications.png)


