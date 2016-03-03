//
//  EHMJobs.h
//  eHireMe-iOS
//
//  Created by Mac Liu on 3/1/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface EHMJobs : NSObject

@property (strong, nonatomic) NSString *company;
@property (strong, nonatomic) NSString *employerId;
@property (strong, nonatomic) NSString *desc;
@property (strong, nonatomic) NSString *type;
@property (strong, nonatomic) NSString *payRate;

- (id)initWithDictionary:(NSDictionary *)dictionary;

@end
